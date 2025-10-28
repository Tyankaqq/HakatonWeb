<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('parameter_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('parameter_id')->constrained()->onDelete('cascade');
            $table->jsonb('value');
            $table->enum('comparison_operator', ['>', '<', '>=', '<=', '=', '!='])->default('=');

            $table->unique(['user_id', 'parameter_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('parameter_user');
    }
};
