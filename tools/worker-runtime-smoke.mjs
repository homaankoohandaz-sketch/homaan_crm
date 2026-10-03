const task = process.argv.at(-1) ?? "";
process.stdout.write(JSON.stringify({ ok: true, worker: "buildwise_local", task }));
