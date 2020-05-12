using FluentValidation;

namespace CatalinTudoran.Planets.ViewModels.Validations
{
    public class CredentialsViewModelValidator : AbstractValidator<CredentialsViewModel>
    {
        public CredentialsViewModelValidator()
        {
            RuleFor(vm => vm.UserName).NotEmpty().WithMessage("Va rog sa introduceti numele utilizator");
            RuleFor(vm => vm.Password).NotEmpty().WithMessage("Va rog sa introduceti parola");
            RuleFor(vm => vm.Password).Length(6, 20).WithMessage("Parola trebuie sa fie intre 6 si 20 de caractere");
        }
    }
}
