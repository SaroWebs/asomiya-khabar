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
        Schema::create('editions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('publication_id')->constrained('publications')->cascadeOnDelete();
            $table->string('name');
            $table->string('code')->nullable();
            $table->text('address')->nullable();
            $table->string('bill_prefix')->nullable();
            $table->string('receipt_prefix')->nullable();
            $table->string('pay_prefix')->nullable();
            $table->string('dn_prefix')->nullable();
            $table->string('cn_prefix')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('editions');
    }
};
