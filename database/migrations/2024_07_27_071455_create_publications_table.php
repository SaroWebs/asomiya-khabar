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
        Schema::create('publications', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->nullable();
            $table->integer('frequency')->default(1);
            $table->foreignId('parent_id')->nullable()->constrained('publications')->cascadeOnDelete();
            $table->boolean('supplement')->default(0);
            $table->string('rni_no')->nullable();
            $table->string('davp_code')->nullable();
            $table->boolean('late_city')->default(0);
            $table->string('mr_code')->nullable();
            $table->decimal('daily_rate', 5, 2)->nullable();
            $table->boolean('active')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('publications');
    }
};
