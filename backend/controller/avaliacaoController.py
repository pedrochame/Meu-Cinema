from dao import avaliacaoDAO

class avaliacaoController():
    def __init__(self):
        self.repo = avaliacaoDAO()

    def verificaAvaliacao(self,usuario_id,filme_id,tipo):
        return self.repo.verificaAvaliacao(usuario_id,filme_id,tipo)

    def buscaAvaliacoes(self,usuario_id):
        resp = self.repo.buscaAvaliacoes(usuario_id)
        return resp
    
    def criaAvaliacao(self,usuario_id,filme_id,tipo,nota):

        
        resp = self.repo.criaAvaliacao(usuario_id,filme_id,tipo,nota)
        if resp == False:
            print("Avaliação de usuário "+str(usuario_id)+", filme/série "+str(filme_id)+" e nota " + str(nota) + " não cadastrada.")
        else:
            print("Avaliação de usuário "+str(usuario_id)+", filme/série "+str(filme_id)+" e nota " + str(nota) + " cadastrada.")
            
        return resp
    
    def apagarAvaliacao(self,usuario_id,filme_id,tipo):
        resp = self.repo.apagarAvaliacao(usuario_id,filme_id,tipo)
        if resp == False:
            print("Avaliação de usuário = "+usuario_id+" e filme/série = "+filme_id+" não deletada.")
        else:
            print("Avaliação de usuário = "+usuario_id+" e filme/série = "+filme_id+" deletada.")
        return resp