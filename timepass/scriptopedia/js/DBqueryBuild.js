<!---DB Query formations--->

//------Insert Build-----------------
	const DB_InsertQueryFormation = () => {
		let insertInputTableName = prompt("Please enter table name with schema (ex: admin.tableName): ");
	
		if (!insertInputTableName) {
			alertify.error("Operation canceled.");
			return;
		}
	
		let insertColumnCount = parseInt(prompt("How many columns are you inserting?"));
	
		if (isNaN(insertColumnCount) || insertColumnCount <= 0) {
			alertify.error("Please enter a valid number of columns.");
			return;
		}
	
		let columns = [];
		let values = [];
	
		for (let i = 1; i <= insertColumnCount; i++) {
			let colName = prompt(`Enter name for column ${i}:`);
			let colValue = prompt(`Enter value for ${colName}:`);
	
			columns.push(colName);
			values.push(`'${colValue}'`);
		}
	
		const generatedInsertQuery = `INSERT INTO ${insertInputTableName} (${columns.join(', ')}) VALUES (${values.join(', ')});`;
	
		// The logic: Flexbox keeps the text and the icon on the same line.
		// The icon is a clickable span.
		const content = `
			<div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); padding: 5px;">
				<span id="queryText" style="word-break: break-all; font-family: monospace;" class="index-alert">${generatedInsertQuery}</span>
				<span id="copyIcon" style="cursor: pointer; font-size: 20px; user-select: none;" class="index-alert" title="Copy to clipboard">&#10065;</span>
			</div>
		`;
	
		alertify.alert(content);
	
		// Attach the click event to the icon after Alertify renders it
		setTimeout(() => {
			const icon = document.getElementById('copyIcon');
			if (icon) {
				icon.onclick = () => {
					navigator.clipboard.writeText(generatedInsertQuery).then(() => {
						alertify.success("Copied!");
						// Visual feedback: briefly change the icon
						icon.classList.add("index-alert");
						icon.innerHTML = "&#10004;";  // ✅ sign added
						setTimeout(() => { icon.innerHTML = "&#10065;"; }, 1000);
					});
				};
			}
		}, 100);
	};

//------Update Build-----------------
const DB_UpdateQueryFormation = () => {
    let updateInputTableName = prompt("Please enter table name with schema (ex: admin.tableName): ");

    if (!updateInputTableName) {
        alertify.error("Operation canceled.");
        return;
    }

    // 1. Get columns to update
    let updateColumnCount = parseInt(prompt("How many columns are you UPDATING?"));
    if (isNaN(updateColumnCount) || updateColumnCount <= 0) {
        alertify.error("Please enter a valid number of columns.");
        return;
    }

    let setClauses = [];
    for (let i = 1; i <= updateColumnCount; i++) {
        let colName = prompt(`(Update) Enter name for column ${i}:`);
        let colValue = prompt(`(Update) Enter new value for ${colName}:`);
        // We wrap values in quotes for the SET part
        setClauses.push(`${colName} = '${colValue}'`);
    }

    // 2. Get WHERE clause criteria with Operator logic
    let whereColumnCount = parseInt(prompt("How many conditions for the WHERE clause?"));
    if (isNaN(whereColumnCount) || whereColumnCount <= 0) {
        alertify.error("An UPDATE without a WHERE clause is dangerous and was canceled.");
        return;
    }

    let whereClauses = [];
    for (let i = 1; i <= whereColumnCount; i++) {
        let colName = prompt(`(WHERE) Enter condition column ${i}:`);
        
        // Show examples in the prompt to guide the user
        let operator = prompt(`(WHERE) Enter operator for ${colName}\nExamples: =, !=, <, >, LIKE, ILIKE, IS, IS NOT`, "=");
        
        if (!operator) operator = "=";

        let colValue = prompt(`(WHERE) Enter value for ${colName} (Leave blank if using IS NULL):`);

        // Logic to handle NULLs or special operators where quotes aren't needed
        if (operator.toUpperCase() === "IS" || operator.toUpperCase() === "IS NOT") {
            whereClauses.push(`${colName} ${operator} ${colValue || 'NULL'}`);
        } else {
            whereClauses.push(`${colName} ${operator} '${colValue}'`);
        }
    }

    // 3. Construct the Query
    const generatedUpdateQuery = `UPDATE ${updateInputTableName} SET ${setClauses.join(', ')} WHERE ${whereClauses.join(' AND ')};`;

    // UI Logic
    const content = `
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); padding: 5px;">
            <span id="updateQueryText" style="word-break: break-all; font-family: monospace;" class="index-alert">${generatedUpdateQuery}</span>
            <span id="updateCopyIcon" style="cursor: pointer; font-size: 20px; user-select: none;" class="index-alert" title="Copy to clipboard">&#10065;</span>
        </div>
    `;

    alertify.alert(content);

    setTimeout(() => {
        const icon = document.getElementById('updateCopyIcon');
        if (icon) {
            icon.onclick = () => {
                navigator.clipboard.writeText(generatedUpdateQuery).then(() => {
                    alertify.success("Copied!");
                    icon.innerHTML = "&#10004;"; 
                    setTimeout(() => { icon.innerHTML = "&#10065;"; }, 1000);
                });
            };
        }
    }, 100);
};

//------Delete Build -----------------
const DB_DeleteQueryFormation = () => {
    let deleteInputTableName = prompt("Please enter table name with schema (ex: admin.tableName): ");

    if (!deleteInputTableName) {
        alertify.error("Operation canceled.");
        return;
    }

    // 1. Get WHERE clause criteria (Safety check remains)
    let deleteWhereCount = parseInt(prompt("How many conditions for the DELETE (WHERE clause)?"));

    if (isNaN(deleteWhereCount) || deleteWhereCount <= 0) {
        alertify.error("DELETE aborted. You must provide at least one WHERE condition for safety.");
        return;
    }

    let whereClauses = [];
    for (let i = 1; i <= deleteWhereCount; i++) {
        let colName = prompt(`(WHERE) Enter condition column ${i}:`);
        
        // Operator prompt with examples
        let operator = prompt(`(WHERE) Enter operator for ${colName}\nExamples: =, !=, <, >, LIKE, ILIKE, IS, IS NOT`, "=");
        if (!operator) operator = "=";

        let colValue = prompt(`(WHERE) Enter value for ${colName} (Leave blank if using IS NULL):`);

        // Logic to handle NULLs or special operators where quotes aren't needed
        if (operator.toUpperCase() === "IS" || operator.toUpperCase() === "IS NOT") {
            whereClauses.push(`${colName} ${operator} ${colValue || 'NULL'}`);
        } else {
            whereClauses.push(`${colName} ${operator} '${colValue}'`);
        }
    }

    // 2. Construct the Query
    const generatedDeleteQuery = `DELETE FROM ${deleteInputTableName} WHERE ${whereClauses.join(' AND ')};`;

    // 3. UI Content (Red text for danger)
    const content = `
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); padding: 5px;">
            <span id="deleteQueryText" style="word-break: break-all; font-family: monospace;" class="index-alert">${generatedDeleteQuery}</span>
            <span id="deleteCopyIcon" style="cursor: pointer; font-size: 20px; user-select: none;" class="index-alert" title="Copy to clipboard">&#10065;</span>
        </div>
    `;

    alertify.alert(content);

    // 4. Clipboard Logic
    setTimeout(() => {
        const icon = document.getElementById('deleteCopyIcon');
        if (icon) {
            icon.onclick = () => {
                navigator.clipboard.writeText(generatedDeleteQuery).then(() => {
                    alertify.success("Copied!");
                    icon.innerHTML = "&#10004;"; 
                    setTimeout(() => { icon.innerHTML = "&#10065;"; }, 1000);
                });
            };
        }
    }, 100);
};

//------Alter Build-----------------
const DB_AlterQueryFormation = () => {
    let tableName = prompt("Please enter table name with schema (ex: admin.tableName): ");
    if (!tableName) {
        alertify.error("Operation canceled.");
        return;
    }

    let menu = "Choose Alter Action:\n" +
               "1. ADD Column\n" +
               "2. DROP Column\n" +
               "3. RENAME Column\n" +
               "4. MODIFY Column Type\n" +
               "5. SET DEFAULT Value\n" +
               "6. DROP DEFAULT Value\n" +
               "7. ADD Primary Key\n" +
               "8. ADD Foreign Key\n" +
               "9. RENAME Table";

    let action = prompt(menu);
    let generatedAlterQuery = "";

    switch (action) {
        case "1": // ADD
            let addCol = prompt("New column name:");
            let addType = prompt("Data type (ex: VARCHAR(50)):");
            generatedAlterQuery = `ALTER TABLE ${tableName} ADD ${addCol} ${addType};`;
            break;

        case "2": // DROP
            let dropCol = prompt("Column name to remove:");
            generatedAlterQuery = `ALTER TABLE ${tableName} DROP COLUMN ${dropCol};`;
            break;

        case "3": // RENAME COLUMN
            let oldCol = prompt("Current column name:");
            let newCol = prompt("New column name:");
            generatedAlterQuery = `ALTER TABLE ${tableName} RENAME COLUMN ${oldCol} TO ${newCol};`;
            break;

        case "4": // MODIFY TYPE
            let modCol = prompt("Column name:");
            let modType = prompt("New data type (ex: TEXT):");
            // Standard PostgreSQL/ANSI syntax
            generatedAlterQuery = `ALTER TABLE ${tableName} ALTER COLUMN ${modCol} TYPE ${modType};`;
            break;

        case "5": // SET DEFAULT
            let defCol = prompt("Column name:");
            let defVal = prompt("Default value (strings in ' '):");
            generatedAlterQuery = `ALTER TABLE ${tableName} ALTER COLUMN ${defCol} SET DEFAULT ${defVal};`;
            break;

        case "6": // DROP DEFAULT
            let noDefCol = prompt("Column name:");
            generatedAlterQuery = `ALTER TABLE ${tableName} ALTER COLUMN ${noDefCol} DROP DEFAULT;`;
            break;

        case "7": // ADD PRIMARY KEY
            let pkCol = prompt("Column name for Primary Key:");
            generatedAlterQuery = `ALTER TABLE ${tableName} ADD PRIMARY KEY (${pkCol});`;
            break;

        case "8": // ADD FOREIGN KEY
            let fkCol = prompt("Local column name:");
            let refTable = prompt("Referenced table (ex: public.users):");
            let refCol = prompt("Referenced column (ex: id):");
            generatedAlterQuery = `ALTER TABLE ${tableName} ADD CONSTRAINT fk_${fkCol} FOREIGN KEY (${fkCol}) REFERENCES ${refTable} (${refCol});`;
            break;

        case "9": // RENAME TABLE
            let newTableName = prompt("Enter NEW table name (just the name, no schema):");
            generatedAlterQuery = `ALTER TABLE ${tableName} RENAME TO ${newTableName};`;
            break;

        default:
            alertify.error("Invalid selection.");
            return;
    }

    // UI Logic
    const content = `
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); padding: 5px;">
            <span id="alterQueryText" style="word-break: break-all; font-family: monospace;" class="index-alert">${generatedAlterQuery}</span>
            <span id="alterCopyIcon" style="cursor: pointer; font-size: 20px; user-select: none;" class="index-alert" title="Copy to clipboard">&#10065;</span>
        </div>
    `;

    alertify.alert(content);

    setTimeout(() => {
        const icon = document.getElementById('alterCopyIcon');
        if (icon) {
            icon.onclick = () => {
                navigator.clipboard.writeText(generatedAlterQuery).then(() => {
                    alertify.success("Copied!");
                    icon.innerHTML = "&#10004;"; 
                    setTimeout(() => { icon.innerHTML = "&#10065;"; }, 1000);
                });
            };
        }
    }, 100);
};

//------Create Index Build-----------------
const DB_CreateIndexQueryFormation = () => {
    let tableName = prompt("Please enter table name with schema (ex: admin.tableName): ");
    if (!tableName) {
        alertify.error("Operation canceled.");
        return;
    }

    let isUnique = confirm("Should this be a UNIQUE index?\n(Click OK for Unique, Cancel for Normal)");
    
    let columnInput = prompt("Enter column name(s) for the index (for multiple, separate with commas, ex: id, name):");
    if (!columnInput) {
        alertify.error("Operation canceled. Columns are required.");
        return;
    }

    // Generate an index name automatically based on table and columns
    // Clean the table name to remove schema prefix for the index name
    let cleanTableName = tableName.includes('.') ? tableName.split('.')[1] : tableName;
    let cleanColName = columnInput.replace(/[^a-zA-Z0-9]/g, '_');
    let indexName = `idx_${cleanTableName}_${cleanColName}`;

    // Allow user to customize the generated name
    let finalIndexName = prompt("Confirm or change the Index Name:", indexName);

    // 2. Construct the Query
    const uniqueStr = isUnique ? "UNIQUE " : "";
    const generatedIndexQuery = `CREATE ${uniqueStr}INDEX ${finalIndexName} ON ${tableName} (${columnInput});`;

    // 3. UI Logic (Using Blue/Teal for "Creation" tasks)
    const content = `
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); padding: 5px;">
            <span id="indexQueryText" style="word-break: break-all; font-family: monospace;" class="index-alert">${generatedIndexQuery}</span>
            <span id="indexCopyIcon" style="cursor: pointer; font-size: 20px; user-select: none;" class="index-alert" title="Copy to clipboard">&#10065;</span>
        </div>
    `;

    alertify.alert(content);

    // 4. Clipboard Logic
    setTimeout(() => {
        const icon = document.getElementById('indexCopyIcon');
        if (icon) {
            icon.onclick = () => {
                navigator.clipboard.writeText(generatedIndexQuery).then(() => {
                    alertify.success("Copied!");
                    icon.innerHTML = "&#10004;"; 
                    setTimeout(() => { icon.innerHTML = "&#10065;"; }, 1000);
                });
            };
        }
    }, 100);
};