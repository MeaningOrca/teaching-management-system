# Configuring MySQL for Djang

## Step 1: Access MySQL

```cmd
mysql -u root -p
```

---

## Step 2: Create a New Database

```sql
CREATE DATABASE teaching_management;
```

---

## Step 3: Create a New User

```sql
CREATE USER 'liuxuesheng'@'localhost' IDENTIFIED BY 'tiangong2025';
```

---

## Step 4: Grant Privileges to the User

```sql
GRANT ALL PRIVILEGES ON teaching_management.* TO 'liuxuesheng'@'localhost';
```

Apply the privilege changes:

```sql
FLUSH PRIVILEGES;
```

---

## Step 5: Install requirements

```cmd
pip install -r requirements.txt
```

---

## Step 6: Run Django Migrations

Finally, apply Django migrations to set up the database schema:

```cmd
python teaching_management_system/manage.py makemigrations
python teaching_management_system/manage.py migrate
```

---
