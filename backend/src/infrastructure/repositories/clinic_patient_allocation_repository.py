from typing import List, Optional
from sqlalchemy.orm import Session
from infrastructure.databases.mssql import session
from infrastructure.models.billing.clinic_patient_allocation_model import ClinicPatientAllocationModel
from domain.models.clinic_patient_allocation import ClinicPatientAllocation
from domain.models.iclinic_patient_allocation_repository import IClinicPatientAllocationRepository


class ClinicPatientAllocationRepository(IClinicPatientAllocationRepository):
    def __init__(self, db_session: Session = session):
        self.session = db_session

    def _to_domain(self, model: ClinicPatientAllocationModel) -> ClinicPatientAllocation:
        return ClinicPatientAllocation(
            allocation_id=model.allocation_id,
            clinic_account_id=model.clinic_account_id,
            patient_account_id=model.patient_account_id,
            credits_allocated=model.credits_allocated,
            credits_used=model.credits_used or 0
        )

    def add(self, clinic_account_id: int, patient_account_id: int, credits_allocated: int) -> ClinicPatientAllocation:
        try:
            existing = self.session.query(ClinicPatientAllocationModel).filter_by(
                clinic_account_id=clinic_account_id,
                patient_account_id=patient_account_id
            ).first()
            if existing:
                existing.credits_allocated = (existing.credits_allocated or 0) + credits_allocated
                self.session.commit()
                self.session.refresh(existing)
                return self._to_domain(existing)
            model = ClinicPatientAllocationModel(
                clinic_account_id=clinic_account_id,
                patient_account_id=patient_account_id,
                credits_allocated=credits_allocated,
                credits_used=0
            )
            self.session.add(model)
            self.session.commit()
            self.session.refresh(model)
            return self._to_domain(model)
        except Exception as e:
            self.session.rollback()
            raise ValueError(f'Error creating allocation: {str(e)}')
        finally:
            self.session.close()

    def get_by_id(self, allocation_id: int) -> Optional[ClinicPatientAllocation]:
        try:
            model = self.session.query(ClinicPatientAllocationModel).filter_by(allocation_id=allocation_id).first()
            return self._to_domain(model) if model else None
        except Exception as e:
            raise ValueError(f'Error getting allocation: {str(e)}')
        finally:
            self.session.close()

    def get_by_clinic_and_patient(self, clinic_account_id: int, patient_account_id: int) -> Optional[ClinicPatientAllocation]:
        try:
            model = self.session.query(ClinicPatientAllocationModel).filter_by(
                clinic_account_id=clinic_account_id,
                patient_account_id=patient_account_id
            ).first()
            return self._to_domain(model) if model else None
        except Exception as e:
            raise ValueError(f'Error getting allocation: {str(e)}')
        finally:
            self.session.close()

    def get_by_clinic(self, clinic_account_id: int) -> List[ClinicPatientAllocation]:
        try:
            models = self.session.query(ClinicPatientAllocationModel).filter_by(
                clinic_account_id=clinic_account_id
            ).all()
            return [self._to_domain(m) for m in models]
        except Exception as e:
            raise ValueError(f'Error getting allocations by clinic: {str(e)}')
        finally:
            self.session.close()

    def get_by_patient(self, patient_account_id: int) -> List[ClinicPatientAllocation]:
        try:
            models = self.session.query(ClinicPatientAllocationModel).filter_by(
                patient_account_id=patient_account_id
            ).all()
            return [self._to_domain(m) for m in models]
        except Exception as e:
            raise ValueError(f'Error getting allocations by patient: {str(e)}')
        finally:
            self.session.close()

    def increment_credits_used(self, allocation_id: int, amount: int = 1) -> Optional[ClinicPatientAllocation]:
        try:
            model = self.session.query(ClinicPatientAllocationModel).filter_by(allocation_id=allocation_id).first()
            if not model:
                return None
            model.credits_used = (model.credits_used or 0) + amount
            self.session.commit()
            self.session.refresh(model)
            return self._to_domain(model)
        except Exception as e:
            self.session.rollback()
            raise ValueError(f'Error incrementing credits_used: {str(e)}')
        finally:
            self.session.close()

    def update_credits_allocated(self, allocation_id: int, credits_allocated: int) -> Optional[ClinicPatientAllocation]:
        try:
            model = self.session.query(ClinicPatientAllocationModel).filter_by(allocation_id=allocation_id).first()
            if not model:
                return None
            model.credits_allocated = credits_allocated
            self.session.commit()
            self.session.refresh(model)
            return self._to_domain(model)
        except Exception as e:
            self.session.rollback()
            raise ValueError(f'Error updating credits_allocated: {str(e)}')
        finally:
            self.session.close()
