import json
import subprocess
import re

def get_existing_titles():
    try:
        # Fetch all existing issues (open and closed) to avoid duplicates
        result = subprocess.run(
            ["gh", "issue", "list", "--state", "all", "--limit", "500", "--json", "title"],
            capture_output=True, text=True, check=True
        )
        issues = json.loads(result.stdout)
        return {issue["title"] for issue in issues}
    except subprocess.CalledProcessError:
        return set()

def parse_backlog(file_path):
    existing_titles = get_existing_titles()
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split by Epics
    epics = re.split(r'(?=Epic [A-Z] —)', content)
    
    commands = []
    
    for epic_section in epics:
        if not epic_section.strip() or not epic_section.startswith("Epic"):
            continue
            
        # Parse Epic Title
        epic_match = re.match(r'Epic ([A-Z]) — (.*)', epic_section)
        if not epic_match:
            continue
            
        epic_id = epic_match.group(1)
        epic_title = epic_match.group(2).strip()
        label = f"Epic-{epic_id}"
        
        # Split by items (X.Y)
        items = re.split(r'(?=\n[A-Z]\.\d+ )', epic_section)
        
        for item_section in items:
            if not item_section.strip():
                continue
                
            # Parse Item Title
            item_match = re.search(r'([A-Z]\.\d+) (.*)', item_section)
            if not item_match:
                continue
                
            item_id = item_match.group(1)
            item_title_text = item_match.group(2).strip()
            
            title_final = f"[{item_id}] {item_title_text}"
            
            # CHECK IF EXISTS
            if title_final in existing_titles:
                continue

            # Helper to extract field
            def get_field(name):
                pattern = rf'{name}: (.*?)(?=\n[A-Z]|\nCritérios|\nEst|\nDep|\Z)'
                match = re.search(pattern, item_section, re.DOTALL)
                return match.group(1).strip() if match else ""

            description = get_field("Descrição")
            criteria = get_field("Critérios")
            estimate = get_field("Est")
            dependencies = get_field("Dep")

            # Construct Issue Body
            body = f"""**Descrição**
{description}

**Critérios de Aceite**
{criteria}

**Estimativa:** {estimate}
**Dependências:** {dependencies}

*Original ID: {item_id}*
"""
            # Escape quotes for shell
            title_escaped = title_final.replace('"', '\\"')
            body_escaped = body.replace('"', '\\"')
            
            # Construct gh command
            # Labels: Epic-X, backlog
            # Project: "DominusLeads MVP" (ID 8)
            cmd = f'gh issue create --title "{title_escaped}" --body "{body_escaped}" --label "{label},backlog" --project "DominusLeads MVP"'
            commands.append(cmd)

    return commands

if __name__ == "__main__":
    file_path = "docs/backlog.md"
    try:
        cmds = parse_backlog(file_path)
        # Verify if gh is installed / authenticated implicitly by the subprocess call
        
        print(f"# Generating {len(cmds)} NEW commands (skipped existing). Run this script's output in your shell.")
        print("# Note: Ensure you are logged in with 'gh auth login' first.")
        print("")
        for cmd in cmds:
            print(cmd)
    except FileNotFoundError:
        print(f"Error: {file_path} not found.")
