<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CepService;
use Illuminate\Http\JsonResponse;
use RuntimeException;

class CepController extends Controller
{
    public function show(string $cep, CepService $cepService): JsonResponse
    {
        $normalizedCep = preg_replace('/\D/', '', $cep);

        if (strlen($normalizedCep) !== 8) {
            return response()->json([
                'message' => 'O CEP deve conter 8 números.',
            ], 422);
        }

        try {
            $address = $cepService->find($normalizedCep);
        } catch (RuntimeException $exception) {
            return response()->json([
                'message' => $exception->getMessage(),
            ], 503);
        }

        if ($address === null) {
            return response()->json([
                'message' => 'CEP não encontrado.',
            ], 404);
        }

        return response()->json([
            'data' => $address,
        ]);
    }
}
