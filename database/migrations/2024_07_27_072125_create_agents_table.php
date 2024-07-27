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
        Schema::create('agents', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('contact_person')->nullable();
            $table->string('phone')->nullable();
            $table->string('fax_no')->nullable();
            $table->string('email')->nullable();
            $table->string('postal_code')->nullable();
            $table->text('address')->nullable();
            
            $table->foreignId('parent')->nullable()->constrained('agents')->cascadeOnDelete();
            $table->foreignId('agency_type_id')->constrained('agency_types')->cascadeOnDelete();
            $table->foreignId('location_id')->constrained('locations')->cascadeOnDelete();
            $table->foreignId('route_id')->constrained('circulation_routes')->cascadeOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agents');
    }
};
