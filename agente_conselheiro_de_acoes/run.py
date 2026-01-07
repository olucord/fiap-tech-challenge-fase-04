import random
import time

from agent import AgenteConselheiroDeAcoes

print("--- SIMULAÇÃO DO AGENTE CONSELHEIRO DE AÇÕES ---")

# Instancia o agente (cria arquivos se não existirem)
agente = AgenteConselheiroDeAcoes()

# Histórico inicial fictício
market_history = [100.0, 100.5, 101.0]

# Loop de 15 dias para teste
for dia in range(1, 16):
    # 1. Simula virada do dia (Novo preço real para hoje)
    preco_ontem = market_history[-1]
    preco_hoje = preco_ontem * (1 + random.uniform(-0.02, 0.02))
    market_history.append(preco_hoje)

    print(f"\n=== DIA {dia} | Preço: ${preco_hoje:.2f} ===")

    # 2. Agente aprende com o que aconteceu de ontem pra hoje
    if dia > 1:
        msg, var = agente.learn(preco_hoje)
        if msg:
            print(f" > Aprendizado: {msg} (Var Real: {var * 100:.2f}%)")
            print(
                f" > Novo Limiar de Segurança: {agente.policy['threshold'] * 100:.4f}%"
            )

    # 3. Agente decide para amanhã com novo limiar já ajustado
    action, pred, delta = agente.decide(market_history)
    print(f" > Decisão: {action} (Delta Previsto: {delta * 100:.2f}%)")
    time.sleep(0.5)  # Pausa para leitura

print("\n--- FIM ---")
print(
    "Arquivos 'policy.json' e 'memory.db' Atualizados (ou criados se ainda não existirem)."
)
