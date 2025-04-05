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
            print("Usuário com nome = "+nome+" e senha = "+senha+" não encontrado.")
        else:
            print("Usuário com nome = "+nome+" e senha = "+senha+" encontrado.")
        return resp
    
    def criaUsuario(self,nome,senha):
        resp = self.repo.criaUsuario(nome,senha)
        if resp == False:
            print("Usuário com nome = "+nome+" e senha = "+senha+" não cadastrado.")
        else:
            print("Usuário com nome = "+nome+" e senha = "+senha+" cadastrado.")
        return resp