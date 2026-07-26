<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Http\Client\ConnectionException;
use RuntimeException;

class CepService
{
    public function find(string $cep): ?array
    {
        $normalizedCep = preg_replace('/\D/', '', $cep);

        try {
            $response = Http::acceptJson()
                ->timeout(5)
                ->get("https://viacep.com.br/ws/{$normalizedCep}/json/");
        } catch (ConnectionException) {
            throw new RuntimeException(
                'Não foi possível conectar ao serviço de CEP.'
            );
        }

        if ($response->failed()) {
            throw new RuntimeException(
                'O serviço de CEP retornou uma resposta inválida.'
            );
        }

        $data = $response->json();

        if ($data['erro'] ?? false) {
            return null;
        }

        return [
            'cep' => $data['cep'] ?? null,
            'logradouro' => $data['logradouro'] ?? null,
            'bairro' => $data['bairro'] ?? null,
            'cidade' => $data['localidade'] ?? null,
            'uf' => $data['uf'] ?? null,
        ];
    }
}