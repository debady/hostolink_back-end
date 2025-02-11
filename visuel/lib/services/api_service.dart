import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  static const String baseUrl = 'http://localhost:3000'; // Assure-toi que c'est bien ton URL API

  /// 🔹 Récupérer la liste des utilisateurs
  static Future<List<dynamic>> getUsers() async {
    final response = await http.get(Uri.parse('$baseUrl/users'));
    
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Erreur lors de la récupération des utilisateurs');
    }
  }

  /// 🔹 Ajouter un utilisateur
  static Future<void> createUser(String nom, String prenom, String email, String telephone, String pays) async {
    final response = await http.post(
      Uri.parse('$baseUrl/users'),
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({
        "nom": nom,
        "prenom": prenom,
        "email": email,
        "telephone": telephone,
        "pays": pays
      }),
    );

    if (response.statusCode != 201) {
      throw Exception('Erreur lors de la création de l\'utilisateur');
    }
  }
}
