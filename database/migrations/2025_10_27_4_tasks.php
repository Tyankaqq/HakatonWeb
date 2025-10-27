<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();

            $table->jsonb('parameters');

            $table->timestamps();


        });

        DB::statement('CREATE INDEX tasks_parameters_gin_idx ON tasks USING GIN (parameters)');
    }

    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
