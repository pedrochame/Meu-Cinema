from dao import favoritoDAO

class favoritoController():
    def __init__(self):
        self.repo = favoritoDAO()

    def verificaFavorito(self,usuario_id,filme_id,tipo):
        return self.repo.verificaFavorito(usuario_id,filme_id,tipo)

    def buscaFavoritos(self,usuario_id):
        resp = self.repo.buscaFavoritos(usuario_id)
        return resp
    
    def criaFavorito(self,usuario_id,filme_id,tipo):
        resp = self.repo.criaFavorito(usuario_id,filme_id,tipo)
        if resp == False:
            print("Favorito de usuário = "+usuario_id+" e filme = "+filme_id+" não cadastrado.")
        else:
            print("Favorito de usuário = "+usuario_id+" e filme = "+filme_id+" cadastrado.")
        return resp
    
    def apagarFavorito(self,usuario_id,filme_id,tipo):
        resp = self.repo.apagarFavorito(usuario_id,filme_id,tipo)
        if resp == False:
            print("Favorito de usuário = "+usuario_id+" e filme = "+filme_id+" não deletado.")
        else:
            print("Favorito de usuário = "+usuario_id+" e filme = "+filme_id+" deletado.")
        return resp