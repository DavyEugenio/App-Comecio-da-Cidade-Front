import { EstabelecimentoDTO } from './estabelecimento.dto';

export interface UsuarioDTO {
    id: string;
    nome: string;
    email: string;
    cpf: string;
    estabelecimentos?: EstabelecimentoDTO[];
    imageUrl?: string;
}