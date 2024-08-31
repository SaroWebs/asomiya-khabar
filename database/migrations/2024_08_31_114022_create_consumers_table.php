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
        Schema::create('consumers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('consumer_type_id')->nullable()->constrained('consumer_types'); // setnull ondelete
            $table->foreignId('location_id')->nullable()->constrained('locations');
            $table->foreignId('zone_id')->nullable()->constrained('zones');
            $table->foreignId('circulation_route_id')->nullable()->constrained('circulation_routes');
            $table->text('address')->nullable();
            $table->string('pin')->nullable();
            $table->string('phone')->nullable();
            $table->string('fax')->nullable();
            $table->string('email')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('consumers');
    }
};
