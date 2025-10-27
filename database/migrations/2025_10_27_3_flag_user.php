<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('flag_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('flag_id')->constrained()->onDelete('cascade');
            $table->jsonb('value');

            $table->unique(['user_id', 'flag_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('flag_user');
    }
};
