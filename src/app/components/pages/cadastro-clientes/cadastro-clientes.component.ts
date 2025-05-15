import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cadastro-clientes',
  imports: [
    FormsModule, //biblioteca de formulários 
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './cadastro-clientes.component.html',
  styleUrl: './cadastro-clientes.component.css'
})
export class CadastroClientesComponent {
  
  // Declaração do formulário reativo
  clienteForm: FormGroup;

  // Injeta FormBuilder e HttpClient no construtor
  constructor(private fb: FormBuilder, private http: HttpClient) {
    // Inicializa o formulário com os campos e suas validações
    this.clienteForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      enderecos: this.fb.array([this.criarEndereco()])
    });
  }

  // Getter para facilitar o acesso ao array de endereços
  get enderecos(): FormArray {
    return this.clienteForm.get('enderecos') as FormArray;
  }

  // Função para criar um novo grupo de endereço com validações
  criarEndereco(): FormGroup {
    return this.fb.group({
      logradouro: ['', Validators.required],
      complemento: [''],
      numero: ['', Validators.required],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      uf: ['', [Validators.required, Validators.maxLength(2)]],
      cep: ['', Validators.required]
    });
  }

  // Adiciona um novo endereço ao array de endereços
  adicionarEndereco(): void {
    this.enderecos.push(this.criarEndereco());
  }

  // Remove um endereço do array pelo índice
  removerEndereco(index: number): void {
    this.enderecos.removeAt(index);
  }

  // Envia os dados do formulário
  onSubmit(): void {
    // Imprime os dados no console no formato legível
    console.log(JSON.stringify(this.clienteForm.value, null, 2));
    
    // Verifica se o formulário é inválido e marca todos os campos como "tocados"
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      return;
    }

    // Extrai os dados brutos do formulário
    const rawData = this.clienteForm.value;

    // Prepara o payload para envio à API
    const payload = {
      nome: rawData.nome,
      email: rawData.email,
      cpf: rawData.cpf,
      dataNascimento: new Date(rawData.dataNascimento).toISOString(), // <-- conversão correta
      enderecos: rawData.enderecos
    };

    // Envia o POST para o backend
    this.http.post('http://localhost:8080/cadastrar', payload).subscribe({
      next: (res) => {
        console.log('Cliente salvo com sucesso!', res);
        alert('Cadastro realizado com sucesso!');
        this.clienteForm.reset(); // limpa o formulário
        this.enderecos.clear(); // limpa os endereços
        this.adicionarEndereco(); // recomeça com 1 endereço
      },
      error: (err) => {
        console.error('Erro ao salvar cliente:', err);
        alert('Erro ao salvar cliente.');
      }
    });
  }
}