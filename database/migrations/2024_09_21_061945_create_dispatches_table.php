<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('dispatches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agent_id')->constrained('agents');
            $table->foreignId('publication_id')->constrained('publications');
            $table->date('date')->nullable();
            $table->unsignedInteger('free_copies')->default(0);
            $table->unsignedInteger('paid_copies')->default(0);
            $table->unsignedInteger('packets')->default(0);
            $table->unsignedInteger('returned')->default(0);
            $table->foreignId('bill_id')->nullable()->default(null)->constrained('bills')->onDelete('set null');
            $table->unsignedInteger('billded_copies')->default(0);
            $table->decimal('rate', 5, 2)->default(0);
            $table->decimal('commission_rate', 5, 2)->default(0);
            $table->string('credit_notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dispatches');
    }
};
