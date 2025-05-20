
import { CommonModule } from '@angular/common'; 
import { HttpClient } from '@angular/common/http'; 
import { Component } from '@angular/core'; 
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { RouterLink } from '@angular/router'; 


@Component({
  selector: 'app-consulta-clientes',
  imports: [ 
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './consulta-clientes.component.html', 
  styleUrl: './consulta-clientes.component.css' 
})
export class ConsultaClientesComponent {

  // Declaração do formulário reativo
  consultaForm: FormGroup;

  // Variáveis para armazenar o cliente retornado ou a lista de clientes
  cliente: any = null;
  clientes: any[] = [];

  // Mensagem de erro para exibir no template, se necessário
  erroConsulta: string = '';

  // Injeta o FormBuilder e o HttpClient no construtor
  constructor(private fb: FormBuilder, private http: HttpClient) {
    // Inicializa o formulário com um campo de ID vazio
    this.consultaForm = this.fb.group({
      id: ['']
    });
  }

  // Método chamado ao enviar o formulário para consultar clientes
  consultarCliente(): void {
    this.erroConsulta = ''; // Limpa mensagem de erro
    this.cliente = null;    // Limpa cliente individual
    this.clientes = [];     // Limpa lista de clientes

    // Obtém o valor do ID do formulário e remove espaços
    const id = this.consultaForm.value.id?.trim();

    if (id) {
      // Se houver ID, consulta cliente específico
      this.http.get(`http://localhost:8080/Listar/${id}`).subscribe({
        next: (res) => {
          this.cliente = res; // Armazena cliente retornado
        },
        error: (err) => {
          console.error('Erro na consulta:', err);
          this.erroConsulta = 'Cliente não encontrado ou erro ao consultar.';
        }
      });
    } else {
      // Se não houver ID, lista todos os clientes
      this.http.get<any[]>('http://localhost:8080/listar').subscribe({
        next: (res) => {
          this.clientes = res; // Armazena lista de clientes
          if (this.clientes.length === 0) {
            this.erroConsulta = 'Nenhum cliente encontrado.';
          }
        },
        error: (err) => {
          console.error('Erro ao listar clientes:', err);
          this.erroConsulta = 'Erro ao buscar a lista de clientes.';
        }
      });
    }
  }

  // 🗑️ Método para excluir um cliente pelo ID
  excluirCliente(id: string): void {
    const confirmacao = confirm('Tem certeza que deseja excluir este cliente?');

    if (confirmacao) {
      // Chamada DELETE para excluir o cliente pelo ID
      this.http.delete(`http://localhost:8080/deletar/${id}`, { responseType: 'text' }).subscribe({
        next: () => {
          alert('Cliente excluído com sucesso!');
          this.consultarCliente(); // Atualiza a lista após exclusão
        },
        error: (err) => {
          console.error('Erro ao excluir cliente:', err);
          alert('Erro ao excluir cliente.');
        }
      });
    }
  }
}
