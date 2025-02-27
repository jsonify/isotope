import { readFile } from 'fs/promises';
import * as readline from 'readline';

async function findNextTask(): Promise<{ section: string; task: string } | null> {
  try {
    const content = await readFile('todo-list.md', 'utf-8');
    const lines = content.split('\n');

    let currentSection = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Update current section when we hit a ## heading
      if (line.startsWith('## ')) {
        currentSection = line.substring(3);
        continue;
      }

      // Look for uncompleted tasks
      if (line.startsWith('- [ ]')) {
        const task = line.substring(6);
        return {
          section: currentSection,
          task: task.trim(),
        };
      }
    }

    return null;
  } catch (error) {
    console.error('Error reading todo list:', error);
    return null;
  }
}

async function askToProceed(task: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => {
    rl.question(`Would you like to proceed with this task? (y/n): `, answer => {
      rl.close();
      resolve(answer.toLowerCase() === 'y');
    });
  });
}

async function main() {
  const nextTask = await findNextTask();

  if (!nextTask) {
    console.log('🎉 All tasks are completed!');
    return;
  }

  console.log('\nNext task to work on:');
  console.log(`Section: ${nextTask.section}`);
  console.log(`Task: ${nextTask.task}\n`);

  const proceed = await askToProceed(nextTask.task);

  if (proceed) {
    console.log("\n✨ Great! Let's get started on this task!");
  } else {
    console.log("\n👍 No problem, come back when you're ready!");
  }
}

// Run the script
main().catch(console.error);
