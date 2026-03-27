<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;

class FinanceController extends Controller
{
    public function index()
    {
        $transactions = Transaction::orderBy('transaction_date', 'desc')->get();
        return response()->json([
            'success' => true,
            'data' => $transactions
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'description_ar' => 'required|string',
            'description_en' => 'nullable|string',
            'amount' => 'required|numeric',
            'type' => 'required|in:income,expense',
            'category_ar' => 'required|string',
            'category_en' => 'nullable|string',
            'transaction_date' => 'required|date',
        ]);

        $transaction = Transaction::create($data);

        return response()->json([
            'success' => true,
            'data' => $transaction
        ]);
    }

    public function destroy($id)
    {
        $transaction = Transaction::findOrFail($id);
        $transaction->delete();
        return response()->json(['success' => true]);
    }
}
