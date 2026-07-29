<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCustomerRequest;
use App\Models\Customer;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\UpdateCustomerRequest;

class CustomerController extends Controller
{

    public function index(): JsonResponse
    {
        $customers = Customer::query()
            ->latest()
            ->get();

        return response()->json([
            'data' => $customers,
        ]);
    }

    public function store(StoreCustomerRequest $request): JsonResponse
    {
        $customer = Customer::create($request->validated());

        return response()->json(
            [
                'message' => 'Cliente cadastrado com sucesso.',
                'data' => $customer,
            ],
            201
        );
    }

    public function update(
        UpdateCustomerRequest $request,
        Customer $customer,
    ): JsonResponse {
        $customer->update($request->validated());

        return response()->json([
            'message' => 'Cliente atualizado com sucesso.',
            'data' => $customer->fresh(),
        ]);
    }

    public function destroy(Customer $customer): JsonResponse
    {
        $customer->delete();

        return response()->json([
            'message' => 'Cliente excluído com sucesso.',
        ]);
    }
}
