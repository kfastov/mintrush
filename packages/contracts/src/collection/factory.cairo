#[derive(Drop, Serde)]
struct CreateCollectionInput {
    name: ByteArray,
    symbol: ByteArray,
    base_uri: ByteArray,
    price: u256,
    nonce: u64,
    signature: Span<felt252>,
}

#[starknet::interface]
pub trait CollectionFactoryTrait<TState> {
    // TODO make it an ERC721 contract itself (mint collections to author's wallet)
    fn create_collection(ref self: TState, create_collection_input: CreateCollectionInput);
}

#[starknet::contract]
pub mod CollectionFactory {
    use starknet::{ClassHash, ContractAddress};
    use starknet::{syscalls::deploy_syscall, get_caller_address};
    use super::{CreateCollectionInput, CollectionFactoryTrait};

    #[storage]
    struct Storage {
        collection_implementation: ClassHash,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        CollectionCreated: CollectionCreated,
    }

    // TODO can use ERC721 Transfers if we use ERC721 tokens for collections themselves
    #[derive(starknet::Event, Drop)]
    struct CollectionCreated {
        #[key]
        author: ContractAddress,
        #[key]
        address: ContractAddress,
        name: ByteArray,
        symbol: ByteArray,
        base_uri: ByteArray,
    }

    #[abi(embed_v0)]
    impl CollectionFactoryImpl of CollectionFactoryTrait<ContractState> {
        fn create_collection(ref self: ContractState, create_collection_input: CreateCollectionInput) {
            let caller = get_caller_address();

            let collection_class_hash = self.collection_implementation.read();

            let mut payload = array![];

            // TODO owner and author are separated
            caller.serialize(ref payload);
            create_collection_input.name.serialize(ref payload);
            create_collection_input.symbol.serialize(ref payload);
            create_collection_input.base_uri.serialize(ref payload);

            let (collection_address, _) = deploy_syscall(collection_class_hash, 0, payload.span(), false).unwrap();

            self.emit(CollectionCreated {
                author: caller,
                address: collection_address,
                name: create_collection_input.name,
                symbol: create_collection_input.symbol,
                base_uri: create_collection_input.base_uri,
            });
        }
    }
}
