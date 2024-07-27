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
        Schema::create('circulation_routes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('from_location')->constrained('locations', 'id')->cascadeOnDelete();
            $table->foreignId('to_location')->constrained('locations', 'id')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('circulation_routes');
    }
};
