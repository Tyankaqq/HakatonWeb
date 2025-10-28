<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('parameters', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->enum('value_type', [
                'string',
                'integer',
                'float',
                'boolean',
                'array',
                'date',
                'datetime',
                'timestamp',
                'json'
            ])->default('string');
            $table->boolean('is_active')->default(true);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('parameters');
    }
};
