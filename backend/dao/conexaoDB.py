import psycopg2, os
from dotenv import load_dotenv

# Carregando variáveis de ambiente (arquivo .env)
load_dotenv()

# Conexão com o banco de dados postgre, hospedado no Render
def retornaConexaoDB():

    return psycopg2.connect(
            dbname = os.getenv("DB_NAME"),
            user = os.getenv("DB_USER"),
            password = os.getenv("DB_PASSWORD"),
            host = os.getenv("DB_HOST"),
            port = os.getenv("DB_PORT")
        )