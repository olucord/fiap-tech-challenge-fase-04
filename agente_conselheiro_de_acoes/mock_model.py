import random


class MockLSTM:
    """
    Simula um modelo LSTM.
    Gera uma previsão com um pequeno erro aleatório para fins de teste (+-3%).
    """

    def predict(self, history_data) -> float:
        """
        Faz uma previsão com base nos dados históricos, com um erro aleatório de até 3%.


        Parameters
        ----------
        history_data : list
            Lista de preços históricos

        Returns
        -------
        float
            Previsão do preço com base nos dados históricos
        """
        last_price = history_data[-1]

        # Gera uma variação aleatória entre -3% e +3%
        variation = random.uniform(-0.03, 0.03)

        predicted_price = last_price * (1 + variation)
        return predicted_price
