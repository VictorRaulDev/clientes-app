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
  clienteForm: FormGroup;
  clienteId: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
    this.clienteForm = this.fb.group({
      id: [''],
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      enderecos: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.clienteId = this.route.snapshot.paramMap.get('id') || '';
    if (this.clienteId) {
      this.carregarDadosCliente(this.clienteId);
    }
  }

  get enderecos(): FormArray {
    return this.clienteForm.get('enderecos') as FormArray;
  }

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

  carregarDadosCliente(id: string): void {
    this.http.get<any>(`http://localhost:8080/Listar/${id}`).subscribe({
      next: (cliente) => {
        // Trata dataNascimento para string no formato 'yyyy-MM-dd'
        let dataFormatada = '';
        if (cliente.dataNascimento) {
          if (typeof cliente.dataNascimento === 'string') {
            dataFormatada = cliente.dataNascimento.split('T')[0];
          } else if (cliente.dataNascimento instanceof Date) {
            dataFormatada = cliente.dataNascimento.toISOString().substring(0, 10);
          } else {
            // Caso venha em outro formato, tenta converter
            dataFormatada = new Date(cliente.dataNascimento).toISOString().substring(0, 10);
          }
        }

        this.clienteForm.patchValue({
          id: cliente.id,
          nome: cliente.nome,
          email: cliente.email,
          cpf: cliente.cpf,
          dataNascimento: dataFormatada
        });

        this.enderecos.clear();
        if (cliente.enderecos && cliente.enderecos.length > 0) {
          cliente.enderecos.forEach((end: any) => this.enderecos.push(this.criarEndereco(end)));
        } else {
          this.adicionarEndereco();
        }
      },
      error: (err) => {
        console.error('Erro ao carregar dados do cliente:', err);
        alert('Erro ao carregar cliente.');
      }
    });
  }

  adicionarEndereco(): void {
    this.enderecos.push(this.criarEndereco());
  }

  removerEndereco(index: number): void {
    this.enderecos.removeAt(index);
  }

  atualizarCliente(): void {
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      return;
    }

    const rawData = this.clienteForm.value;

    const payload = {
      ...rawData,
      dataNascimento: new Date(rawData.dataNascimento).toISOString()
    };

    this.http.put('http://localhost:8080/atualizar', payload).subscribe({
      next: () => {
        alert('Cliente atualizado com sucesso!');
        this.router.navigate(['/pages/consulta-cliente']);
      },
      error: (err) => {
        console.error('Erro ao atualizar cliente:', err);
        alert('Erro ao atualizar cliente.');
      }
    });
  }
}
