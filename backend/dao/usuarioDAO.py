import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
from dao.conexaoDB import retornaConexaoDB

# Caminho para o arquivo do banco de dados SQLite
#bd_path = os.path.abspath(os.path.join(__file__, "../../bd.db"))

class usuarioDAO():

    def __init__(self):
        pass

    # Função que recebe um id e retorna o nome do usuário
    def retornaUsuarioNome(self,id):

        # Conexão com o banco de dados postgre, hospedado no Render
        conexao = retornaConexaoDB()

        # Conexão com o banco de dados SQLite
        #conexao = sqlite3.connect(bd_path)

        cursor = conexao.cursor()
        
        # Query alterada de SQLite para PostgreSQL
        #cursor.execute("select nome from usuario where id = ?",[id])
        cursor.execute("select nome,email from usuario where id = %s",[id])
        
        registro = cursor.fetchone()
        conexao.close()
        return registro[0],registro[1]

    # Função que recebe um id e verifica se o usuário existe no banco
    def verificaUsuario(self,id):
        
        # Conexão com o banco de dados postgre, hospedado no Render
        conexao = retornaConexaoDB()

        # Conexão com o banco de dados SQLite
        #conexao = sqlite3.connect(bd_path)

        cursor = conexao.cursor()
        
        # Query alterada de SQLite para PostgreSQL
        #cursor.execute("select * from usuario where id = ?",[id])
        cursor.execute("select * from usuario where id = %s",[id])


        registro = cursor.fetchone()
        conexao.close()
        if registro != None:
            return True
        else:
            return False

    # Função que recebe nome e senha, e busca o usuário no banco.
    # Se encontrar, retorna seu ID. Se não, retorna -1.
    def buscaUsuario(self,nome,senha):
        
        # Conexão com o banco de dados postgre, hospedado no Render
        conexao = retornaConexaoDB()

        # Conexão com o banco de dados SQLite
        #conexao = sqlite3.connect(bd_path)


        cursor = conexao.cursor()
        
        # Query alterada de SQLite para PostgreSQL
        #cursor.execute("select id,senha from usuario where nome = ?",[nome])
        cursor.execute("select id,senha from usuario where nome = %s",[nome])

        registro = cursor.fetchone()
        conexao.close()
        if registro != None:
            senhaBanco = registro[1]
            if check_password_hash(senhaBanco,senha):
                return registro[0]
            return -1
        else:
            return -1
    
    # Função que recebe nome e senha e inclui um usuário no banco.
    # Se for possível incluir, retorna True. Se não, retorna False.
    def criaUsuario(self,nome,senha,email):

        # Criptografando senha
        senha = generate_password_hash(senha)

        # Conexão com o banco de dados postgre, hospedado no Render
        conexao = retornaConexaoDB()

        # Conexão com o banco de dados SQLite
        #conexao = sqlite3.connect(bd_path)

        cursor = conexao.cursor()

        # Caso haja outro usuário com o mesmo nome ou email, não avançar
        cursor.execute("select * from usuario where nome = %s or (email is not null and email = %s)",[nome,email])
        registros = cursor.fetchall()
        if len(registros)>0:
            print("Já existe um outro usuário com mesmo nome ou email.")
            return False

        try:
            
            # Query alterada de SQLite para PostgreSQL
            #cursor.execute("insert into usuario(nome,senha) values (?,?)",[nome,senha])
            cursor.execute("insert into usuario(nome,senha,email) values (%s,%s,%s)",[nome,senha,email])
            
            conexao.commit()
            return True
        except:
            pass    
        conexao.close()
        return False