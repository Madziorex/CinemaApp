using CinemaApp.BLL.Interfaces.Services;
using CinemaApp.BLL.Models;
using CinemaApp.DAL.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CinemaApp.BLL.Implementations.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _configuration;

        public UserService(UserManager<User> userManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _configuration = configuration;
        }

        public async Task<string?> CreateAsync(UserRegisterDto user)
        {
            var newUser = new User
            {
                UserName = user.UserName,
                Email = user.Email,
                Role= Role.Client,
            };

            var result = await _userManager.CreateAsync(newUser, user.Password);

            if (result.Succeeded == false)
            {
                throw new Exception($"Unable to create user: {result.Errors}");
            }

            return GetToken(newUser);
        }

        public async Task DeleteAsync(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                throw new Exception("Unable to find user");
            }
            await _userManager.DeleteAsync(user);
        }

        public async Task<string?> LoginAsync(UserLoginDto user)
        {
            var newUser = await _userManager.FindByEmailAsync(user.Email);
            if (newUser == null)
            {
                return null;
            }
            if (await _userManager.CheckPasswordAsync(newUser, user.Password) == false)
            {
                return null;
            }
            return GetToken(newUser);
        }

        public async Task UpdateAsync(string id, UserDto user)
        {
            var userFromDb = await _userManager.FindByIdAsync(id);

            if (userFromDb == null)
            {
                throw new Exception("Unable to find user");
            }

            userFromDb.Email = user.Email ?? userFromDb.Email;
            userFromDb.UserName = user.UserName ?? userFromDb.UserName;
            userFromDb.Role = user.Role;

            if (user.Password != null)
            {
                userFromDb.PasswordHash = _userManager.PasswordHasher.HashPassword(userFromDb, user.Password);
            }

            var updateResult = await _userManager.UpdateAsync(userFromDb);

            if (updateResult.Succeeded == false)
            {
                throw new Exception("Unable to update user");
            }
        }

        public async Task SetAdminAsync(string id, Role role)
        {
            var user = await _userManager.FindByIdAsync(id);

            if (user != null)
            {
                user.Role = role;

                var updateResult = await _userManager.UpdateAsync(user);

                if (updateResult.Succeeded == false)
                {
                    throw new Exception("Unable to update user");
                }
            }
        }

        private string GetToken(User user)
        {
            var secretKey = _configuration["Jwt:SecretKey"];
            if (secretKey == null)
            {
                throw new Exception("Unable to get SecretKey");
            }

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email == null ? "" : user.Email),
                new Claim("role", user.Role.ToString())
            };

            var issuer = _configuration["Jwt:ValidIssuer"];
            var audience = _configuration["Jwt:ValidAudience"];

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token).ToString();
        }
    }
}
