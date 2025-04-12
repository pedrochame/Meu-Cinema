import sqlite3

# Caminho para o arquivo do banco de dados
bd_path = "backend/bd.db"

class favoritoDAO():

    def __init__(self):
        pass

    # Função que recebe um id de usuário e retorna seus favoritos.
    def buscaFavoritos(self,usuario_id):
        conexao = sqlite3.connect(bd_path)
        cursor = conexao.cursor()
        cursor.execute("select filme_id,tipo from favorito where usuario_id = ?",[int(usuario_id)])
        registros = cursor.fetchall()
        conexao.close()

        registros_json = []
        for registro in registros:
            registros_json.append({"filme_id":registro[0] , "tipo":registro[1]})

        return registros_json
    
    # Função que recebe id de usuário, id do filme/série no TMDB e tipo ('filme' ou 'serie') e inclui um favorito no banco.
    # Se for possível incluir, retorna True. Se não, retorna False.
    def criaFavorito(self,usuario_id,filme_id,tipo):
        conexao = sqlite3.connect(bd_path)
        cursor = conexao.cursor()
        try:
            cursor.execute("insert into favorito(usuario_id,filme_id,tipo) values (?,?,?)",[int(usuario_id),filme_id,tipo])
            conexao.commit()
            return True
        except:
            pass    
        conexao.close()
        return False
    

    # Função que recebe id de usuário, id do filme/série no TMDB e tipo ('filme' ou 'serie') e deleta o favorito no banco.
    # Se for possível deletar, retorna True. Se não, retorna False.
    def apagarFavorito(self,usuario_id,filme_id,tipo):
        conexao = sqlite3.connect(bd_path)
        cursor = conexao.cursor()
        try:
            cursor.execute("delete from favorito where usuario_id = ? and filme_id = ? and tipo = ?",[int(usuario_id),filme_id,tipo])
            conexao.commit()
            return True
        except:
            pass 
        conexao.close()
        return False
    

    # Função que verifica um favorito
    def verificaFavorito(self,usuario_id,filme_id,tipo):
        conexao = sqlite3.connect(bd_path)
        cursor = conexao.cursor()
        cursor.execute("select * from favorito where usuario_id = ? and filme_id = ? and tipo = ?",[int(usuario_id),filme_id,tipo])
        registro = cursor.fetchone()
        conexao.close()
        if registro != None:
            return True
        else:
            return False