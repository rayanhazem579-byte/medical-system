<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InvoiceController extends Controller
{
    public function index()
    {
        return Invoice::with(['patient', 'items'])->orderBy('created_at', 'desc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'items' => 'required|array|min:1',
            'items.*.description_ar' => 'required|string',
            'items.*.description_en' => 'nullable|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',
            'tax' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
            'due_date' => 'nullable|date',
        ]);

        return DB::transaction(function () use ($validated) {
            $total_amount = collect($validated['items'])->sum(function ($item) {
                return $item['quantity'] * $item['unit_price'];
            });

            $discount = $validated['discount'] ?? 0;
            $tax = $validated['tax'] ?? 0;
            $net_amount = ($total_amount - $discount) + $tax;

            $invoice = Invoice::create([
                'patient_id' => $validated['patient_id'],
                'invoice_number' => 'INV-' . date('Ymd') . '-' . strtoupper(bin2hex(random_bytes(2))),
                'total_amount' => $total_amount,
                'discount' => $discount,
                'tax' => $tax,
                'net_amount' => $net_amount,
                'status' => 'unpaid',
                'due_date' => $validated['due_date'] ?? now()->addDays(7),
                'notes' => $validated['notes'] ?? null,
            ]);

            foreach ($validated['items'] as $item) {
                InvoiceItem::create([
                    'invoice_id' => $invoice->id,
                    'description_ar' => $item['description_ar'],
                    'description_en' => $item['description_en'] ?? null,
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'subtotal' => $item['quantity'] * $item['unit_price'],
                ]);
            }

            return $invoice->load(['patient', 'items']);
        });
    }

    public function pay(Request $request, $id)
    {
        $invoice = Invoice::findOrFail($id);
        
        return DB::transaction(function () use ($invoice) {
            $invoice->update(['status' => 'paid']);

            // Create a transaction record for the income
            Transaction::create([
                'description_ar' => "دفع فاتورة رقم " . $invoice->invoice_number,
                'description_en' => "Payment for Invoice " . $invoice->invoice_number,
                'amount' => $invoice->net_amount,
                'type' => 'income',
                'category_ar' => 'فواتير',
                'category_en' => 'Invoices',
                'transaction_date' => now(),
            ]);

            return $invoice->load(['patient', 'items']);
        });
    }

    public function destroy($id)
    {
        $invoice = Invoice::findOrFail($id);
        $invoice->delete();
        return response()->json(['message' => 'Invoice deleted successfully']);
    }
}
