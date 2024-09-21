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
            $table->boolean('free')->default(false);
            $table->boolean('paid')->default(false);
            $table->string('membership')->nullable();
            $table->string('subscription')->nullable();
            $table->unsignedInteger('packets')->default(0);
            $table->unsignedInteger('returned')->default(0);
            $table->foreignId('billid')->constrained('bills')->nullable();
            $table->unsignedInteger('rate')->default(0);
            $table->unsignedInteger('commission_rate')->default(0);
            $table->unsignedInteger('billded_copies')->default(0);
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
