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
        Schema::create('bills', function (Blueprint $table) {
            $table->id();
            $table->string('prefix')->nullable();
            $table->string('bill_no')->nullable();
            $table->date('date')->nullable();
            $table->string('type')->nullable();
            $table->foreignId('publication_id')->constrained('publications')->nullable();
            $table->foreignId('agent_id')->constrained('agents')->nullable();
            $table->string('client_name')->nullable();
            $table->string('ro_no')->nullable();
            $table->date('ro_date')->nullable();
            $table->unsignedInteger('gross_amount')->nullable();
            $table->unsignedInteger('commission')->nullable();
            $table->unsignedInteger('discount')->nullable();
            $table->unsignedInteger('over_all')->nullable();
            $table->unsignedInteger('advance')->nullable();
            $table->unsignedInteger('round_off')->nullable();
            $table->unsignedInteger('recovered')->nullable();
            $table->foreignId('location_id')->constrained('locations')->nullable();
            $table->string('billing_address')->nullable();
            $table->boolean('printed')->default(false);
            $table->boolean('locked')->default(false);
            $table->boolean('cleared')->default(false);
            $table->boolean('approved')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bills');
    }
};
