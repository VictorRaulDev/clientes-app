// Importação dos módulos e serviços necessários
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-edicao-clientes', 
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './edicao-clientes.component.html', 
  styleUrls: ['./edicao-clientes.component.css']  
})
export class EdicaoClientesComponent {

  // Formulário reativo para edição do cliente
  clienteForm: FormGroup;

  // ID do cliente extraído da URL
  clienteId: string = '';

  // Construtor com injeção de dependências
  constructor(
    private fb: FormBuilder,           // Construtor de formulários
    private route: ActivatedRoute,     // Permite acessar parâmetros da rota (URL)
    private router: Router,            // Permite navegação entre rotas
    private http: HttpClient           // Realiza chamadas HTTP
  ) {
    // Inicializa o formulário com campos padrão e validações
    this.clienteForm = this.fb.group({
      id: [''],
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      enderecos: this.fb.array([]) // FormArray para múltiplos endereços
    });
  }

  // Lifecycle hook chamado ao inicializar o componente
  ngOnInit(): void {
    // Obtém o ID do cliente da URL
    this.clienteId = this.route.snapshot.paramMap.get('id') || '';
    
    // Se houver um ID, carrega os dados do cliente
    if (this.clienteId) {
      this.carregarDadosCliente(this.clienteId);
    }
  }

  // Getter para facilitar o acesso ao FormArray de endereços
  get enderecos(): FormArray {
    return this.clienteForm.get('enderecos') as FormArray;
  }

  // Método para criar um novo grupo de endereço (com dados opcionais)
  criarEndereco(data?: any): FormGroup {
    return this.fb.group({
      id: [data?.id || ''],
      logradouro: [data?.logradouro || '', Validators.required],
      complemento: [data?.complemento || ''],
      numero: [data?.numero || '', Validators.required],
      bairro: [data?.bairro || '', Validators.required],
      cidade: [data?.cidade || '', Validators.required],
      uf: [data?.uf || '', [Validators.required, Validators.maxLength(2)]],
      cep: [data?.cep || '', Validators.required]
    });
  }

  // Método que carrega os dados do cliente a partir do backend
  carregarDadosCliente(id: string): void {
    this.http.get<any>(`http://localhost:8080/Listar/${id}`).subscribe({
      next: (cliente) => {
        // Converte a data de nascimento para o formato 'yyyy-MM-dd' se necessário
        let dataFormatada = '';
        if (cliente.dataNascimento) {
          if (typeof cliente.dataNascimento === 'string') {
            dataFormatada = cliente.dataNascimento.split('T')[0];
          } else if (cliente.dataNascimento instanceof Date) {
            dataFormatada = cliente.dataNascimento.toISOString().substring(0, 10);
          } else {
            dataFormatada = new Date(cliente.dataNascimento).toISOString().substring(0, 10);
          }
        }

        // Preenche os campos do formulário com os dados do cliente
        this.clienteForm.patchValue({
          id: cliente.id,
          nome: cliente.nome,
          email: cliente.email,
          cpf: cliente.cpf,
          dataNascimento: dataFormatada
        });

        // Limpa e adiciona os endereços recebidos
        this.enderecos.clear();
        if (cliente.enderecos && cliente.enderecos.length > 0) {
          cliente.enderecos.forEach((end: any) => this.enderecos.push(this.criarEndereco(end)));
        } else {
          this.adicionarEndereco(); // Adiciona um endereço vazio se não houver nenhum
        }
      },
      error: (err) => {
        console.error('Erro ao carregar dados do cliente:', err);
        alert('Erro ao carregar cliente.');
      }
    });
  }

  // Adiciona um novo endereço vazio ao formulário
  adicionarEndereco(): void {
    this.enderecos.push(this.criarEndereco());
  }

  // Remove um endereço específico pelo índice
  removerEndereco(index: number): void {
    this.enderecos.removeAt(index);
  }

  // Envia os dados atualizados do cliente para o backend
  atualizarCliente(): void {
    // Se o formulário estiver inválido, marca todos os campos como tocados e interrompe o envio
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      return;
    }

    const rawData = this.clienteForm.value;

    // Prepara os dados a serem enviados, convertendo data para ISO string
    const payload = {
      ...rawData,
      dataNascimento: new Date(rawData.dataNascimento).toISOString()
    };

    // Envia os dados atualizados via PUT
    this.http.put('http://localhost:8080/atualizar', payload).subscribe({
      next: () => {
        alert('Cliente atualizado com sucesso!');
        this.router.navigate(['/pages/consulta-cliente']); // Redireciona para a tela de consulta
      },
      error: (err) => {
        console.error('Erro ao atualizar cliente:', err);
        alert('Erro ao atualizar cliente.');
      }
    });
  }
}
