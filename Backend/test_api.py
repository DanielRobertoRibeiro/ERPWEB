"""Testes básicos da API que não dependem de um MySQL em execução.

Execute a partir da pasta Backend:
    python -m unittest test_api.py
"""

import unittest
from unittest.mock import patch

from api import app


class ApiTestCase(unittest.TestCase):
    def setUp(self):
        app.config["TESTING"] = True
        self.client = app.test_client()

    def test_rejeita_cliente_sem_campos_obrigatorios(self):
        response = self.client.post("/api/clientes", json={})

        self.assertEqual(response.status_code, 400)
        self.assertFalse(response.json["success"])
        self.assertEqual(response.json["message"], "Razão social é obrigatória.")

    def test_rejeita_produto_com_estoque_negativo(self):
        response = self.client.post(
            "/api/produtos",
            json={
                "name": "Tinta teste",
                "category": "Tintas",
                "brand": "Marca teste",
                "stock": -1,
                "price": 50,
            },
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("Estoque", response.json["message"])

    @patch("api.conectar_banco", return_value=None)
    def test_retorna_503_quando_banco_esta_indisponivel(self, _conectar_banco):
        response = self.client.get("/api/clientes")

        self.assertEqual(response.status_code, 503)
        self.assertFalse(response.json["success"])
        self.assertEqual(response.headers["Access-Control-Allow-Origin"], "*")


if __name__ == "__main__":
    unittest.main()
