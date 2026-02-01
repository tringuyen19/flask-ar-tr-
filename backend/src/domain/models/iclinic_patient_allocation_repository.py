from abc import ABC, abstractmethod
from .clinic_patient_allocation import ClinicPatientAllocation
from typing import List, Optional


class IClinicPatientAllocationRepository(ABC):
    @abstractmethod
    def add(self, clinic_account_id: int, patient_account_id: int, credits_allocated: int) -> ClinicPatientAllocation:
        pass

    @abstractmethod
    def get_by_id(self, allocation_id: int) -> Optional[ClinicPatientAllocation]:
        pass

    @abstractmethod
    def get_by_clinic_and_patient(self, clinic_account_id: int, patient_account_id: int) -> Optional[ClinicPatientAllocation]:
        pass

    @abstractmethod
    def get_by_clinic(self, clinic_account_id: int) -> List[ClinicPatientAllocation]:
        pass

    @abstractmethod
    def get_by_patient(self, patient_account_id: int) -> List[ClinicPatientAllocation]:
        pass

    @abstractmethod
    def increment_credits_used(self, allocation_id: int, amount: int = 1) -> Optional[ClinicPatientAllocation]:
        pass

    @abstractmethod
    def update_credits_allocated(self, allocation_id: int, credits_allocated: int) -> Optional[ClinicPatientAllocation]:
        pass
