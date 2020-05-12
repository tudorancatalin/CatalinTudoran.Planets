using ServiceStack.FluentValidation.Attributes;
using CatalinTudoran.Planets.ViewModels.Validations;

namespace CatalinTudoran.Planets.ViewModels
{
    [Validator(typeof(CredentialsViewModelValidator))]
    public class CredentialsViewModel
    {
        public string UserName { get; set; }
        public string Password { get; set; }
    }
}
