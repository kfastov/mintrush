#[starknet::interface]
pub trait ERC721CollectionTrait<TContractState> {
    fn mint(ref self: TContractState);
}

#[starknet::contract]
mod ERC721Collection {
    use openzeppelin::token::erc721::ERC721Component;
    use openzeppelin::introspection::src5::SRC5Component;

    component!(path: ERC721Component, storage: erc721_storage, event: ERC721Event);
    component!(path: SRC5Component, storage: src5_storage, event: SRC5Event);

    #[abi(embed_v0)]
    impl ERC721Impl = ERC721Component::ERC721MixinImpl<ContractState>;
    #[abi(embed_v0)]
    impl SRC5Impl = SRC5Component::SRC5Impl<ContractState>;

    #[storage]
    struct Storage {
        #[substorage(v0)]
        erc721_storage: ERC721Component::Storage,
        #[substorage(v0)]
        src5_storage: SRC5Component::Storage,
    }
    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        ERC721Event: ERC721Component::Event,
        #[flat]
        SRC5Event: SRC5Component::Event,
    }

    #[abi(embed_v0)]
    impl ERC721CollectionImpl<ContractState> of super::ERC721CollectionTrait<ContractState> {
        fn mint(ref self: ContractState) {}
    }
}


#[cfg(test)]
mod tests {
    use super::ERC721Collection;

    #[test]
    fn it_works() {
        assert(6 * 7 == 42, 'it works!');
    }
}
