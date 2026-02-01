"""
Clinic Patient Allocation Service - Business Logic Layer
Logic: Clinic mua gói (vd 10000 lượt). Cấp cho từng patient (vd 100 lượt/người).
Khi patient upload ảnh: trừ 1 từ pool clinic (subscription.remaining_credits) và 1 từ allocation.credits_used.
Patient 101 không được cấp thêm nếu clinic đã hết pool.
"""

from typing import List, Optional
from domain.models.clinic_patient_allocation import ClinicPatientAllocation
from domain.models.iclinic_patient_allocation_repository import IClinicPatientAllocationRepository
from domain.exceptions import BusinessRuleException, NotFoundException
from services.subscription_service import SubscriptionService
from services.account_service import AccountService


# Role ID for ClinicManager (used to get clinic's subscription account)
CLINIC_MANAGER_ROLE_ID = 4


class ClinicPatientAllocationService:
    def __init__(
        self,
        allocation_repository: IClinicPatientAllocationRepository,
        subscription_service: SubscriptionService,
        account_service: AccountService,
    ):
        self.allocation_repo = allocation_repository
        self.subscription_service = subscription_service
        self.account_service = account_service

    def allocate(self, clinic_account_id: int, patient_account_id: int, credits: int) -> ClinicPatientAllocation:
        """Phòng khám cấp credits lượt upload cho bệnh nhân (từ pool của clinic)."""
        if credits <= 0:
            raise BusinessRuleException("credits must be positive")
        return self.allocation_repo.add(clinic_account_id, patient_account_id, credits)

    def get_by_clinic_and_patient(self, clinic_account_id: int, patient_account_id: int) -> Optional[ClinicPatientAllocation]:
        return self.allocation_repo.get_by_clinic_and_patient(clinic_account_id, patient_account_id)

    def get_by_clinic(self, clinic_account_id: int) -> List[ClinicPatientAllocation]:
        return self.allocation_repo.get_by_clinic(clinic_account_id)

    def get_by_patient(self, patient_account_id: int) -> List[ClinicPatientAllocation]:
        return self.allocation_repo.get_by_patient(patient_account_id)

    def consume_upload_credit(self, patient_account_id: int, clinic_id: int) -> None:
        """
        Trừ 1 lượt upload: từ pool clinic (subscription) và từ allocation của patient.
        Gọi trước khi lưu retinal image. Nếu không đủ credits thì raise BusinessRuleException.
        """
        # 1. Lấy account phòng khám (ClinicManager) để lấy subscription
        clinic_account = self.account_service.get_clinic_manager_account(clinic_id)
        if not clinic_account:
            raise BusinessRuleException("Clinic has no manager account or clinic not found")

        # 2. Lấy subscription active của clinic
        subscription = self.subscription_service.get_active_subscription(clinic_account.account_id)
        if not subscription:
            raise BusinessRuleException("Clinic has no active subscription (no upload credits)")
        if subscription.remaining_credits <= 0:
            raise BusinessRuleException("Clinic has no remaining upload credits (pool exhausted)")

        # 3. Lấy allocation của patient tại clinic này
        allocation = self.allocation_repo.get_by_clinic_and_patient(clinic_account.account_id, patient_account_id)
        if not allocation:
            raise BusinessRuleException("Patient has no upload allocation from this clinic")
        if allocation.credits_used >= allocation.credits_allocated:
            raise BusinessRuleException("Patient has no remaining upload credits (allocation exhausted)")

        # 4. Trừ pool clinic
        self.subscription_service.deduct_credit(subscription.subscription_id, 1)
        # 5. Trừ allocation (credits_used += 1)
        self.allocation_repo.increment_credits_used(allocation.allocation_id, 1)
