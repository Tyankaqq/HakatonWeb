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
            $table->string('task_id')->unique();
            $table->string('title');
            $table->enum('priority', ['low', 'medium', 'high'])->default('medium'); // Срочность выполнения
            $table->integer('weight')->default(1); // Сложность/важность задачи (1-10)
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->jsonb('parameters');
            $table->timestamp('assigned_at')->nullable(); // Когда задача назначена исполнителю
            $table->timestamps();
        });

        DB::statement('CREATE INDEX tasks_parameters_gin_idx ON tasks USING GIN (parameters)');
        DB::statement('CREATE INDEX tasks_priority_idx ON tasks (priority)');
        DB::statement('CREATE INDEX tasks_user_id_idx ON tasks (user_id)');
    }

    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
