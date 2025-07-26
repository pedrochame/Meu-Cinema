from dao import usuarioDAO

class usuarioController():
    def __init__(self):
        self.repo = usuarioDAO()

    def retornaUsuarioNome(self,id):
        return self.repo.retornaUsuarioNome(id)
    
    def verificaUsuario(self,id):
        resp = self.repo.verificaUsuario(id)
        if self.repo.verificaUsuario(id):
            print("Usuário com ID = "+id+ " encontrado!")
        else:
            print("Usuário com ID = "+id+" não encontrado.")
        return resp

    def buscaUsuario(self,nome,senha):
        resp = self.repo.buscaUsuario(nome,senha)
        if resp == -1:
            print("Usuário "+nome+" não encontrado.")
        else:
            print("Usuário "+nome+" encontrado.")
        return resp
    
    def criaUsuario(self,nome,senha):
        resp = self.repo.criaUsuario(nome,senha)
        if resp == False:
            print("Usuário "+nome+" e não cadastrado.")
        else:
            print("Usuário "+nome+" cadastrado.")
        return resp