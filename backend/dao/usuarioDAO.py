import sqlite3,os
from werkzeug.security import generate_password_hash, check_password_hash

# Caminho para o arquivo do banco de dados
bd_path = os.path.abspath(os.path.join(__file__, "../../bd.db"))

class usuarioDAO():

    def __init__(self):
        pass

    # Função que recebe um id e retorna o nome do usuário
    def retornaUsuarioNome(self,id):
        conexao = sqlite3.connect(bd_path)
        cursor = conexao.cursor()
        cursor.execute("select nome from usuario where id = ?",[id])
        registro = cursor.fetchone()
        conexao.close()
        return registro[0]

    # Função que recebe um id e verifica se o usuário existe no banco
    def verificaUsuario(self,id):
        conexao = sqlite3.connect(bd_path)
        cursor = conexao.cursor()
        cursor.execute("select * from usuario where id = ?",[id])
        registro = cursor.fetchone()
        conexao.close()
        if registro != None:
            return True
        else:
            return False

    # Função que recebe nome e senha, e busca o usuário no banco.
    # Se encontrar, retorna seu ID. Se não, retorna -1.
    def buscaUsuario(self,nome,senha):
        conexao = sqlite3.connect(bd_path)
        cursor = conexao.cursor()
        cursor.execute("select id,senha from usuario where nome = ?",[nome])
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
    def criaUsuario(self,nome,senha):

        # Criptografando senha
        senha = generate_password_hash(senha)

        conexao = sqlite3.connect(bd_path)
        cursor = conexao.cursor()
        try:
            cursor.execute("insert into usuario(nome,senha) values (?,?)",[nome,senha])
            conexao.commit()
            return True
        except:
            pass    
        conexao.close()
        return False