<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:150',
            ],

            'email' => [
                'required',
                'email',
                'max:150',
                Rule::unique('customers', 'email')
                    ->ignore($this->route('customer')),
            ],

            'cep' => [
                'required',
                'string',
                'regex:/^\d{5}-?\d{3}$/',
            ],

            'street' => [
                'required',
                'string',
                'max:200',
            ],

            'number' => [
                'required',
                'string',
                'max:20',
            ],

            'complement' => [
                'nullable',
                'string',
                'max:150',
            ],

            'neighborhood' => [
                'required',
                'string',
                'max:100',
            ],

            'city' => [
                'required',
                'string',
                'max:100',
            ],

            'state' => [
                'required',
                'string',
                'size:2',
            ],
        ];
    }
}