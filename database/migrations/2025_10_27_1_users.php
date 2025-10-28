<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('middle_name')->nullable();
            $table->boolean('status')->default(true);
            $table->integer('daily_limit')->nullable(); // Суточный лимит задач
            $table->integer('weight')->default(1); // Вес исполнителя (1-10)
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
