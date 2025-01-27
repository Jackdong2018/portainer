import { IFormController } from 'angular';
import { FormikErrors } from 'formik';

import { notifyError } from '@/portainer/services/notifications';
import { IAuthenticationService } from '@/portainer/services/types';
import { GitAuthModel } from '@/react/portainer/gitops/types';
import { gitAuthValidation } from '@/react/portainer/gitops/AuthFieldset';
import { getGitCredentials } from '@/portainer/views/account/git-credential/gitCredential.service';
import { GitCredential } from '@/portainer/views/account/git-credential/types';

import { validateForm } from '@@/form-components/validate-form';

export default class GitFormAuthFieldsetController {
  errors?: FormikErrors<GitAuthModel> = {};

  $async: <T>(fn: () => Promise<T>) => Promise<T>;

  gitFormAuthFieldset?: IFormController;

  gitCredentials: Array<GitCredential> = [];

  Authentication: IAuthenticationService;

  value?: GitAuthModel;

  onChange?: (value: GitAuthModel) => void;

  /* @ngInject */
  constructor(
    $async: <T>(fn: () => Promise<T>) => Promise<T>,
    Authentication: IAuthenticationService
  ) {
    this.$async = $async;
    this.Authentication = Authentication;

    this.handleChange = this.handleChange.bind(this);
    this.runGitValidation = this.runGitValidation.bind(this);
  }

  async handleChange(newValues: Partial<GitAuthModel>) {
    // this should never happen, but just in case
    if (!this.value) {
      throw new Error('GitFormController: value is required');
    }

    const value = {
      ...this.value,
      ...newValues,
    };
    this.onChange?.(value);
    await this.runGitValidation(value);
  }

  async runGitValidation(value: GitAuthModel) {
    return this.$async(async () => {
      this.errors = {};
      this.gitFormAuthFieldset?.$setValidity(
        'gitFormAuth',
        true,
        this.gitFormAuthFieldset
      );

      this.errors = await validateForm<GitAuthModel>(
        () => gitAuthValidation(this.gitCredentials),
        value
      );
      if (this.errors && Object.keys(this.errors).length > 0) {
        this.gitFormAuthFieldset?.$setValidity(
          'gitFormAuth',
          false,
          this.gitFormAuthFieldset
        );
      }
    });
  }

  async $onInit() {
    try {
      this.gitCredentials = await getGitCredentials(
        this.Authentication.getUserDetails().ID
      );
    } catch (err) {
      notifyError(
        'Failure',
        err as Error,
        'Unable to retrieve user saved git credentials'
      );
    }

    // this should never happen, but just in case
    if (!this.value) {
      throw new Error('GitFormController: value is required');
    }

    await this.runGitValidation(this.value);
  }
}
