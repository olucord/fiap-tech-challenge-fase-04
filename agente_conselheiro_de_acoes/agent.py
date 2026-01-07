import json
import os
import sqlite3
from datetime import datetime

from mock_model import MockLSTM


class AgenteConselheiroDeAcoes:
    def __init__(self):
        """
        Inicializa o agente com arquivos de configuração e o simulador.

        Carrega o simulador (MockLSTM) e a política do agente (se existir).
        Inicializa o banco de dados "memory.db".
        """
        # Configurações do agente
        self.policy_file = "policy.json"
        self.db_file = "memory.db"

        # 1. Carrega o simulador
        self.model = MockLSTM()

        # 2. Carrega Política
        self.policy = self._load_policy()

        # 3. Inicializa Banco de Dados
        self._init_db()

    def _load_policy(self) -> dict[str, float]:
        """
        Carrega a política do agente do arquivo "policy.json" (se existir).

        Se o arquivo não existir, cria um com as configurações iniciais:
        - threshold: 1% de margem para decidir comprar, vender ou manter
        - learning_rate: 5% de ajuste para cada erro

        Returns
        -------
        dict
            [str, float]

        Where:
        - str: Nome da configuração
        - float: Valor da configuração
        """
        if os.path.exists(self.policy_file):
            with open(self.policy_file, "r") as f:
                return json.load(f)

        # Configuração inicial se o arquivo não existir
        default_policy = {
            "threshold": 0.01,  # Começa exigindo 1% de margem
            "learning_rate": 0.05,  # Ajusta 5% a cada erro
        }
        self._save_policy(default_policy)
        return default_policy

    def _save_policy(self, policy_data=None):
        """
        Salva a política do agente no arquivo "policy.json".

        Se policy_data for fornecido, atualiza a política do agente com os dados fornecidos.
        Caso contrário, salva a política atual no arquivo.

        Parameters
        ----------
        policy_data : dict, optional
            Dados da política do agente para serem salvos
        """
        if policy_data:
            self.policy = policy_data
        with open(self.policy_file, "w") as f:
            json.dump(self.policy, f, indent=4)

    def _init_db(self):
        """
        Inicializa o banco de dados "memory.db" com a tabela "history".

        A tabela "history" tem as seguintes colunas:
        - id: Identificador único da decisão (chave primária)
        - date: Data da decisão (formato "YYYY-MM-DD HH:MM:SS")
        - price_at_decision: Preço da ação no momento da decisão
        - predicted_price: Preço previsto pelo modelo
        - action: Ação tomada pelo agente (COMPRAR, VENDER ou MANTER)
        - threshold_used: Limiar de segurança utilizado na decisão
        - outcome_evaluated: Avaliação do resultado da decisão (1 para sim, 0 para não)

        Se o arquivo de banco de dados não existir, cria um com a tabela "history". Se já existir, completa o banco de dados.
        """
        conn = sqlite3.connect(self.db_file)
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT,
                price_at_decision REAL,
                predicted_price REAL,
                action TEXT,
                threshold_used REAL,
                outcome_evaluated INTEGER DEFAULT 0
            )
        """)
        conn.commit()
        conn.close()

    def _record_decision(self, price, pred, action):
        """
        Registra uma decisão tomada pelo agente no banco de dados "memory.db".

        Parameters
        ----------
        price : float
            Preço da ação no momento da decisão
        pred : float
            Preço previsto pelo modelo
        action : str
            Ação tomada pelo agente (COMPRAR, VENDER ou MANTER)
        """
        conn = sqlite3.connect(self.db_file)
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO history (date, price_at_decision, predicted_price, action, threshold_used, outcome_evaluated)
            VALUES (?, ?, ?, ?, ?, 0)
        """,
            (
                datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                price,
                pred,
                action,
                self.policy["threshold"],
            ),
        )
        conn.commit()
        conn.close()

    def learn(self, current_price_today) -> tuple[str, float] | tuple[None, float]:
        """
        Aprende com a última decisão tomada pelo agente.

        Se a última decisão foi COMPRAR ou VENDER e a variação real foi negativa, aumenta o rigor da política.
        Se a última decisão foi MANTER e a variação real foi maior que o rigor da política, diminui o rigor da política.

        Parameters
        ----------
        current_price_today : float
            Preço atual da ação

        Returns
        -------
        str
            Mensagem com o resultado do aprendizado
        float
            Variação real entre o preço de ontem e o preço de hoje
        """
        conn = sqlite3.connect(self.db_file)
        cursor = conn.cursor()

        # Busca última decisão para avaliação e posterior aprendizado
        cursor.execute(
            "SELECT id, action, price_at_decision FROM history WHERE outcome_evaluated = 0 ORDER BY id DESC LIMIT 1"
        )
        last_trade = cursor.fetchone()

        if not last_trade:
            conn.close()
            return None, 0

        trade_id, action, price_yesterday = last_trade
        variacao_real = (current_price_today - price_yesterday) / price_yesterday
        lr = self.policy["learning_rate"]

        # Mensagem padrão
        msg = "Manteve"

        # Punição (Errou a direção)
        if (action == "COMPRAR" and variacao_real < 0) or (
            action == "VENDER" and variacao_real > 0
        ):
            self.policy["threshold"] *= 1 + lr  # Fica mais rigoroso
            msg = "Aumentou rigor (Erro de recomendação)"

        # Correção (Perdeu oportunidade)
        elif action == "MANTER" and abs(variacao_real) > self.policy["threshold"]:
            self.policy["threshold"] *= 1 - lr  # Fica menos rigoroso
            msg = "Diminuiu rigor (Perdeu Oportunidade)"

        # Atualizando a política
        self._save_policy()

        # Marca como aprendido (outcome_evaluated será 1)
        cursor.execute(
            "UPDATE history SET outcome_evaluated = 1 WHERE id = ?", (trade_id,)
        )
        conn.commit()
        conn.close()

        return msg, variacao_real

    def decide(self, market_history) -> tuple[str, float, float]:
        """
        Decide o que fazer com base nos dados do mercado.

        Parameters
        ----------
        market_history : list
            Lista de preços históricos do mercado de ações

        Returns
        -------
        tuple
            (action, predicted_price, delta)

        Where:
        - action: Ação tomada (COMPRAR, VENDER ou MANTER)
        - predicted_price: Preço previsto pelo modelo
        - delta: Variação entre o preço previsto e o preço atual
        """
        current_price = market_history[-1]
        predicted_price = self.model.predict(market_history)

        delta = (predicted_price - current_price) / current_price
        threshold = self.policy["threshold"]

        # Ação padrão sempre é manter (Até que se prove o contrário)
        action = "MANTER"
        if delta > threshold:
            action = "COMPRAR"
        elif delta < -threshold:
            action = "VENDER"

        self._record_decision(current_price, predicted_price, action)
        return action, predicted_price, delta
