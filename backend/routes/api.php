<?php

use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\CepController;
use Illuminate\Support\Facades\Route;

Route::get('/ceps/{cep}', [CepController::class, 'show']);

Route::get('/customers', [CustomerController::class, 'index']);
Route::post('/customers', [CustomerController::class, 'store']);

Route::put('/customers/{customer}', [CustomerController::class, 'update']);
Route::delete('/customers/{customer}', [CustomerController::class, 'destroy']);