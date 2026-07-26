<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCustomerRequest;
use App\Models\Customer;
use Illuminate\Http\JsonResponse;

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
}
