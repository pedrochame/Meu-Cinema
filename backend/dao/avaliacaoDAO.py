import sqlite3,os
from dao.conexaoDB import retornaConexaoDB

# Caminho para o arquivo do banco de dados
#bd_path = os.path.abspath(os.path.join(__file__, "../../bd.db"))

class avaliacaoDAO():

    def __init__(self):
        pass

    # Função que recebe um id de usuário e retorna suas avaliações.
    def buscaAvaliacoes(self,usuario_id):
        
        # Conexão com o banco de dados postgre, hospedado no Render
        conexao = retornaConexaoDB()

        # Conexão com o banco de dados SQLite
        #conexao = sqlite3.connect(bd_path)

        cursor = conexao.cursor()

        # Query alterada de SQLite para PostgreSQL
        #cursor.execute("select filme_id,tipo,nota,data from avaliacao where usuario_id = ? order by data desc",[int(usuario_id)])
        cursor.execute("select filme_id,tipo,nota,data from avaliacao where usuario_id = %s order by data desc",[int(usuario_id)])


        registros = cursor.fetchall()
        conexao.close()

        registros_json = []
        for registro in registros:
            registros_json.append({
                
                "filme_id":registro[0], 
                "tipo":registro[1],
                "nota":registro[2],
                
                # Convertendo a data para o padrão ISO 8601
                #"data":registro[3],
                "data": registro[3].strftime("%Y-%m-%dT%H:%M:%SZ")


            })

        return registros_json
    
    # Função que recebe id de usuário, id do filme/série no TMDB, tipo ('filme' ou 'serie'), uma nota e inclui uma avaliação no banco.
    # Se for possível incluir, retorna True. Se não, retorna False.
    def criaAvaliacao(self,usuario_id,filme_id,tipo,nota):

        # Conexão com o banco de dados postgre, hospedado no Render
        conexao = retornaConexaoDB()

        # Conexão com o banco de dados SQLite
        #conexao = sqlite3.connect(bd_path)


        cursor = conexao.cursor()
        try:

            # Query alterada de SQLite para PostgreSQL
            #cursor.execute("insert into avaliacao(usuario_id,filme_id,tipo,nota) values (?,?,?,?)",[int(usuario_id),filme_id,tipo,int(nota)])

            cursor.execute("insert into avaliacao(usuario_id,filme_id,tipo,nota) values (%s,%s,%s,%s)",[int(usuario_id),filme_id,tipo,int(nota)])


            conexao.commit()
            return True
        except:
            pass    
        conexao.close()
        return False
    

    # Função que recebe id de usuário, id do filme/série no TMDB e tipo ('filme' ou 'serie') e deleta a avaliação no banco.
    # Se for possível deletar, retorna True. Se não, retorna False.
    def apagarAvaliacao(self,usuario_id,filme_id,tipo):
        
        # Conexão com o banco de dados postgre, hospedado no Render
        conexao = retornaConexaoDB()

        # Conexão com o banco de dados SQLite
        #conexao = sqlite3.connect(bd_path)


        cursor = conexao.cursor()
        try:

            # Query alterada de SQLite para PostgreSQL
            #cursor.execute("delete from avaliacao where usuario_id = ? and filme_id = ? and tipo = ?",[int(usuario_id),filme_id,tipo])
            cursor.execute("delete from avaliacao where usuario_id = %s and filme_id = %s and tipo = %s",[int(usuario_id),filme_id,tipo])



            conexao.commit()
            return True
        except:
            pass 
        conexao.close()
        return False
    

    # Função que verifica uma avaliação
    def verificaAvaliacao(self,usuario_id,filme_id,tipo):
        
        # Conexão com o banco de dados postgre, hospedado no Render
        conexao = retornaConexaoDB()

        # Conexão com o banco de dados SQLite
        #conexao = sqlite3.connect(bd_path)

        cursor = conexao.cursor()

        # Query alterada de SQLite para PostgreSQL
        #cursor.execute("select nota,data,id from avaliacao where usuario_id = ? and filme_id = ? and tipo = ?",[int(usuario_id),filme_id,tipo])
        cursor.execute("select nota,data,id from avaliacao where usuario_id = %s and filme_id = %s and tipo = %s",[int(usuario_id),filme_id,tipo])
        
        
        registro = cursor.fetchone()
        conexao.close()
        registro_json = []
        if registro != None:
            registro_json.append({
                "nota":registro[0],

                # Convertendo a data para o padrão ISO 8601
                #"data":registro[1],
                "data": registro[1].strftime("%Y-%m-%dT%H:%M:%SZ"),


                "id"  :registro[2]
            })
        
        return registro_json
    
    # Função que edita uma avaliação
    def editarAvaliacao(self,id,nota):
        
        # Conexão com o banco de dados postgre, hospedado no Render
        conexao = retornaConexaoDB()

        # Conexão com o banco de dados SQLite
        #conexao = sqlite3.connect(bd_path)


        cursor = conexao.cursor()
        try:

            # Query alterada de SQLite para PostgreSQL
            #cursor.execute("update avaliacao set nota = ? , data = CURRENT_TIMESTAMP where id = ?",[int(nota),int(id)])
            cursor.execute("update avaliacao set nota = %s , data = CURRENT_TIMESTAMP where id = %s",[int(nota),int(id)])


            conexao.commit()
            return True
        except:
            pass 
        conexao.close()
        return False