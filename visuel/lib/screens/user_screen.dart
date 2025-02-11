import 'package:flutter/material.dart';
import '../services/api_service.dart';

class UserScreen extends StatefulWidget {
  const UserScreen({super.key});

  @override
  _UserScreenState createState() => _UserScreenState();
}

class _UserScreenState extends State<UserScreen> {
  List<dynamic> users = [];

  @override
  void initState() {
    super.initState();
    fetchUsers();
  }

  /// 🔹 Récupérer les utilisateurs et les afficher
  void fetchUsers() async {
    final data = await ApiService.getUsers();
    setState(() {
      users = data;
    });
  }

  /// 🔹 Ajouter un nouvel utilisateur
  void addUser() async {
    await ApiService.createUser("PAUL", "LOGAB", "LOGAN.user@example.com", "3333333333", "EEE");
    fetchUsers(); // Rafraîchir la liste après ajout
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Liste des Utilisateurs")),
      body: users.isEmpty
          ? Center(child: CircularProgressIndicator())
          : ListView.builder(
              itemCount: users.length,
              itemBuilder: (context, index) {
                return 
               ListTile(
                title: Text(
                  "${users[index]['nom'] ?? 'Inconnu'} ${users[index]['prenom'] ?? ''}",
                ),
                subtitle: Text(users[index]['email'] ?? 'Email non fourni'),
              );

              },
            ),
            floatingActionButton: FloatingActionButton(
              onPressed: addUser,
              child: Icon(Icons.add),
      ),
    );
  }
}
